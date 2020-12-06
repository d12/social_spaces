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

ActiveRecord::Schema.define(version: 2020_12_06_212016) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activity_instances", force: :cascade do |t|
    t.integer "group_id"
    t.integer "status"
    t.string "activity"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.json "storage"
    t.index ["group_id"], name: "index_activity_instances_on_group_id"
  end

  create_table "draw_it_draw_events", force: :cascade do |t|
    t.integer "activity_instance_id"
    t.json "draw_data"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["activity_instance_id"], name: "index_draw_it_draw_events_on_activity_instance_id"
  end

  create_table "groups", force: :cascade do |t|
    t.string "key", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "meet_url"
    t.integer "host_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
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
    t.index ["disconnected_at"], name: "index_users_on_disconnected_at"
    t.index ["group_id"], name: "index_users_on_group_id"
  end

  add_foreign_key "activity_instances", "groups"
  add_foreign_key "users", "groups"
end
