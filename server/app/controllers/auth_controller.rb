class AuthController < ApplicationController
  def register
    user = User.new(email: params[:email], password: params[:password])
    if user.save
      session[:user_id] = user.id
      render json: { ok: true }
    else
      render json: { ok: false, errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: params[:email].to_s.downcase)
    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      render json: { user: user }
    else
      render json: { error: "Invalid email or password" }, status: :unprocessable_entity
    end
  end

  def logout
    session.delete(:user_id)
    render json: { message: "Logged out successfully" }
  end

  def me
    if current_user
      render json: { email: current_user.email }
    else
      render json: { email: nil }, status: :unauthorized
    end
  end

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end
end