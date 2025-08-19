class User < ApplicationRecord
  has_secure_password
  has_many :accounts, dependent: :destroy
  has_many :budget_categories, dependent: :destroy

  validates :email, format: { with: /\A\S+@\S+\z/ },
    uniqueness: { case_sensitive: false }
  validates :password, length: { minimum: 6 },
    confirmation: true, if: -> { password.present? }
end
