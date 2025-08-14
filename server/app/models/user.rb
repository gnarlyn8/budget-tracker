class User < ApplicationRecord
  has_secure_password

  validates :email, format: { with: /\A\S+@\S+\z/ },
    uniqueness: { case_sensitive: false },
  validates :password, length: { minimum: 6 },
    confirmation: true, if: -> { password.present? }
end
