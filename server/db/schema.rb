# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_08_19_000435) do
  create_table "accounts", force: :cascade do |t|
    t.string "name"
    t.string "account_type", null: false
    t.integer "starting_balance_cents", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id"], name: "idx_accounts_one_monthly_budget_per_user", unique: true, where: "account_type = 'monthly_budget'"
    t.index ["user_id"], name: "index_accounts_on_user_id"
  end

  create_table "budget_categories", force: :cascade do |t|
    t.string "name"
    t.decimal "amount"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "category_type", default: "variable_expense", null: false
    t.integer "user_id", null: false
    t.index ["category_type"], name: "index_budget_categories_on_category_type"
    t.index ["user_id"], name: "index_budget_categories_on_user_id"
  end

  create_table "transactions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "budget_category_id"
    t.integer "account_id", null: false
    t.integer "amount_cents", null: false
    t.date "occurred_on", null: false
    t.string "memo"
    t.index ["account_id"], name: "index_transactions_on_account_id"
    t.index ["budget_category_id"], name: "index_transactions_on_budget_category_id"
    t.index ["occurred_on"], name: "index_transactions_on_occurred_on"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email"
  end

  add_foreign_key "accounts", "users"
  add_foreign_key "budget_categories", "users"
  add_foreign_key "transactions", "accounts"
  add_foreign_key "transactions", "budget_categories"
end
