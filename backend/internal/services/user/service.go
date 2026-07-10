package services

import (
	"errors"
	"expense-backend/internal/auth"
	models "expense-backend/internal/models/db_object"
	reqmodels "expense-backend/internal/models/req_dto"
	resmodels "expense-backend/internal/models/res_dto"
	"expense-backend/internal/repository"

	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	userRepo  *repository.User
	tokenRepo *repository.Token
}

func New(userRepo *repository.User, tokenRepo *repository.Token) *Service {
	return &Service{
		userRepo:  userRepo,
		tokenRepo: tokenRepo,
	}
}

func (us *Service) RegisterUser(req *reqmodels.RegisterUserRequestDTO) error {

	existingUser, err := us.userRepo.FindByEmail(req.Email)
	if err != nil && err.Error() != "sql: no rows in result set" {
		return err
	}

	if existingUser != nil {
		return errors.New("Email already exists")
	}

	hashBytes, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	newUser := &models.User{
		Email:        req.Email,
		Name:         req.Name,
		PasswordHash: string(hashBytes),
	}

	err = us.userRepo.AddUser(newUser)
	if err != nil {
		return err
	}

	return nil

}

func (us *Service) LoginUser(req *reqmodels.LoginUserRequestDTO) (*resmodels.LoginUserResponseDTO, error) {
	user, err := us.userRepo.FindByEmail(req.Email)
	if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
	if err != nil {
		return nil, err
	}

	accessToken, err := auth.GenerateAccessToken(user.ID)
	if err != nil {
		return nil, err
	}

	refreshToken, err := auth.GenerateRefreshToken()
	if err != nil {
		return nil, err
	}

	hashedRefreshToken := auth.HashToken(refreshToken)

	err = us.tokenRepo.SaveRefreshToken(user.ID, hashedRefreshToken)
	if err != nil {
		return nil, err
	}

	return &resmodels.LoginUserResponseDTO{
		ID:           user.ID,
		Name:         user.Name,
		Email:        user.Email,
		CreatedAt:    user.CreatedAt,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil

}

func (us *Service) LogoutUser(refreshToken string) error {
	refreshTokenHash := auth.HashToken(refreshToken)

	err := us.userRepo.RevokeUser(refreshTokenHash)
	if err != nil {
		return err
	}

	return nil
}

func (us *Service) RefreshToken(existingrefreshToken string) (*resmodels.LoginUserResponseDTO, error) {
	refreshTokenHash := auth.HashToken(existingrefreshToken)

	userID, err := us.tokenRepo.MarkTokenExpired(refreshTokenHash)
	if err != nil {
		return nil, err
	}

	user, err := us.userRepo.FindById(userID)
	if err != nil {
		return nil, err
	}

	accessToken, err := auth.GenerateAccessToken(userID)
	if err != nil {
		return nil, err
	}

	newRefreshToken, err := auth.GenerateRefreshToken()
	if err != nil {
		return nil, err
	}

	hashedRefreshToken := auth.HashToken(newRefreshToken)

	err = us.tokenRepo.SaveRefreshToken(userID, hashedRefreshToken)
	if err != nil {
		return nil, err
	}

	return &resmodels.LoginUserResponseDTO{
		ID:           user.ID,
		Name:         user.Name,
		Email:        user.Email,
		CreatedAt:    user.CreatedAt,
		AccessToken:  accessToken,
		RefreshToken: newRefreshToken,
	}, nil
}
