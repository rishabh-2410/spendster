package services

import (
	"errors"
	"expense-backend/internal/auth"
	"expense-backend/internal/logging"
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
	logging.Debug("register user service start email=%s name=%s", req.Email, req.Name)

	existingUser, err := us.userRepo.FindByEmail(req.Email)
	if err != nil && err.Error() != "sql: no rows in result set" {
		logging.Error("register user lookup failed email=%s err=%v", req.Email, err)
		return err
	}

	if existingUser != nil {
		logging.Info("register user skipped existing email=%s", req.Email)
		return errors.New("Email already exists")
	}

	hashBytes, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		logging.Error("register user password hash failed email=%s err=%v", req.Email, err)
		return err
	}
	newUser := &models.User{
		Email:        req.Email,
		Name:         req.Name,
		PasswordHash: string(hashBytes),
	}

	err = us.userRepo.AddUser(newUser)
	if err != nil {
		logging.Error("register user repository save failed email=%s err=%v", req.Email, err)
		return err
	}

	logging.Info("register user service success email=%s", req.Email)

	return nil

}

func (us *Service) LoginUser(req *reqmodels.LoginUserRequestDTO) (*resmodels.LoginUserResponseDTO, error) {
	logging.Debug("login user service start email=%s", req.Email)
	user, err := us.userRepo.FindByEmail(req.Email)
	if err != nil {
		logging.Error("login user lookup failed email=%s err=%v", req.Email, err)
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
	if err != nil {
		logging.Error("login user password mismatch email=%s user_id=%s err=%v", req.Email, user.ID, err)
		return nil, err
	}

	accessToken, err := auth.GenerateAccessToken(user.ID)
	if err != nil {
		logging.Error("login user access token generation failed user_id=%s err=%v", user.ID, err)
		return nil, err
	}

	refreshToken, err := auth.GenerateRefreshToken()
	if err != nil {
		logging.Error("login user refresh token generation failed user_id=%s err=%v", user.ID, err)
		return nil, err
	}

	hashedRefreshToken := auth.HashToken(refreshToken)

	err = us.tokenRepo.SaveRefreshToken(user.ID, hashedRefreshToken)
	if err != nil {
		logging.Error("login user refresh token save failed user_id=%s err=%v", user.ID, err)
		return nil, err
	}

	logging.Info("login user service success user_id=%s email=%s", user.ID, user.Email)

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
	logging.Debug("logout user service start refresh_token=%s", logging.Redacted("refresh_token"))
	refreshTokenHash := auth.HashToken(refreshToken)

	err := us.userRepo.RevokeUser(refreshTokenHash)
	if err != nil {
		logging.Error("logout user revoke failed err=%v", err)
		return err
	}

	logging.Info("logout user service success")

	return nil
}

func (us *Service) RefreshToken(existingrefreshToken string) (*resmodels.LoginUserResponseDTO, error) {
	logging.Debug("refresh token service start refresh_token=%s", logging.Redacted("refresh_token"))
	refreshTokenHash := auth.HashToken(existingrefreshToken)

	userID, err := us.tokenRepo.MarkTokenExpired(refreshTokenHash)
	if err != nil {
		logging.Error("refresh token mark expired failed err=%v", err)
		return nil, err
	}

	user, err := us.userRepo.FindById(userID)
	if err != nil {
		logging.Error("refresh token user lookup failed user_id=%s err=%v", userID, err)
		return nil, err
	}

	accessToken, err := auth.GenerateAccessToken(userID)
	if err != nil {
		logging.Error("refresh token access token generation failed user_id=%s err=%v", userID, err)
		return nil, err
	}

	newRefreshToken, err := auth.GenerateRefreshToken()
	if err != nil {
		logging.Error("refresh token generation failed user_id=%s err=%v", userID, err)
		return nil, err
	}

	hashedRefreshToken := auth.HashToken(newRefreshToken)

	err = us.tokenRepo.SaveRefreshToken(userID, hashedRefreshToken)
	if err != nil {
		logging.Error("refresh token save failed user_id=%s err=%v", userID, err)
		return nil, err
	}

	logging.Info("refresh token service success user_id=%s email=%s", user.ID, user.Email)

	return &resmodels.LoginUserResponseDTO{
		ID:           user.ID,
		Name:         user.Name,
		Email:        user.Email,
		CreatedAt:    user.CreatedAt,
		AccessToken:  accessToken,
		RefreshToken: newRefreshToken,
	}, nil
}
