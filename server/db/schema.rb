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

ActiveRecord::Schema[8.0].define(version: 2025_08_12_175524) do
  create_table "accounts", force: :cascade do |t|
    t.string "name"
    t.string "account_type", null: false
    t.integer "starting_balance_cents", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "budget_categories", force: :cascade do |t|
    t.integer "budget_id", null: false
    t.string "name"
    t.decimal "amount"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "category_type", default: "variable_expense", null: false
    t.index ["budget_id"], name: "index_budget_categories_on_budget_id"
    t.index ["category_type"], name: "index_budget_categories_on_category_type"
  end

  create_table "budgets", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "transactions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "budget_category_id", null: false
    t.integer "account_id", null: false
    t.integer "amount_cents", null: false
    t.date "occurred_on", null: false
    t.string "memo"
    t.index ["account_id"], name: "index_transactions_on_account_id"
    t.index ["budget_category_id"], name: "index_transactions_on_budget_category_id"
    t.index ["occurred_on"], name: "index_transactions_on_occurred_on"
  end

  add_foreign_key "budget_categories", "budgets"
  add_foreign_key "transactions", "accounts"
  add_foreign_key "transactions", "budget_categories"
end
