# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_01_28_195345) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activity_instances", force: :cascade do |t|
    t.integer "group_id"
    t.string "activity"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.json "storage"
    t.index ["group_id"], name: "index_activity_instances_on_group_id"
  end

  create_table "groups", force: :cascade do |t|
    t.string "key", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "meet_url"
    t.integer "host_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "provider"
    t.string "uid"
    t.integer "expires_at"
    t.boolean "expires"
    t.bigint "group_id"
    t.text "token_ciphertext"
    t.text "refresh_token_ciphertext"
    t.datetime "disconnected_at"
    t.boolean "guest", default: false, null: false
    t.datetime "last_five_interactions", default: [], null: false, array: true
    t.datetime "joined_group_at"
    t.integer "blob_id"
    t.index ["disconnected_at"], name: "index_users_on_disconnected_at"
    t.index ["group_id"], name: "index_users_on_group_id"
    t.index ["joined_group_at"], name: "index_users_on_joined_group_at"
  end

  add_foreign_key "activity_instances", "groups"
  add_foreign_key "users", "groups"
end
