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

ActiveRecord::Schema.define(version: 2020_06_06_171755) do

  create_table "activity_rooms", force: :cascade do |t|
    t.string "activity_slug", null: false
    t.integer "video_call_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["video_call_id"], name: "index_activity_rooms_on_video_call_id"
  end

  create_table "room_memberships", force: :cascade do |t|
    t.integer "user_id"
    t.integer "activity_room_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["activity_room_id"], name: "index_room_memberships_on_activity_room_id"
    t.index ["user_id"], name: "index_room_memberships_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "video_calls", force: :cascade do |t|
    t.string "url", null: false
    t.integer "timeout_in_days", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "room_memberships", "activity_rooms"
  add_foreign_key "room_memberships", "users"
end
