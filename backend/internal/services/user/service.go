package user

import (
	"errors"
	models "expense-backend/internal/models/db_object"
	reqmodels "expense-backend/internal/models/req_dto"
	resmodels "expense-backend/internal/models/res_dto"
	"expense-backend/internal/repository"
	"expense-backend/internal/utils"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	userRepo  *repository.UserRepository
	tokenRepo *repository.TokenRepo
}

func NewUserService(userRepo *repository.UserRepository, tokenRepo *repository.TokenRepo) *UserService {
	return &UserService{
		userRepo:  userRepo,
		tokenRepo: tokenRepo,
	}
}

func (us *UserService) RegisterUser(req *reqmodels.RegisterUserRequestDTO) error {

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

func (us *UserService) LoginUser(req *reqmodels.LoginUserRequestDTO) (*resmodels.LoginUserResponseDTO, error) {
	user, err := us.userRepo.FindByEmail(req.Email)
	if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
	if err != nil {
		return nil, err
	}

	accessToken, err := utils.GenerateAccessToken(user.ID)
	if err != nil {
		return nil, err
	}

	refreshToken, err := utils.GenerateRefreshToken()
	if err != nil {
		return nil, err
	}

	hashedRefreshToken := utils.HashToken(refreshToken)

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

func (us *UserService) LogoutUser(refreshToken string) error {
	refreshTokenHash := utils.HashToken(refreshToken)

	err := us.userRepo.RevokeUser(refreshTokenHash)
	if err != nil {
		return err
	}

	return nil
}
