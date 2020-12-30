Rails.application.routes.draw do
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  mount ActionCable.server => '/cable'

  get "/(:room_key)", to: "react#show", constraints: { room_key: /[a-zA-Z\d]{6}/ }, as: "react"

  get "/login/google(/join/:room_key)", to: "sessions#redirect_to_google_oauth", constraints: { room_key: /[a-zA-Z\d]{6}/ }

  delete "/logout", to: "sessions#destroy"

  get "/test", to: "react#test", as: "test"

  namespace :api do
    get "/groups/:key", to: "groups#show"
    post "/groups/create", to: "groups#create"
    post "/groups/join", to: "groups#join"
    post "/groups/leave", to: "groups#leave" # todo, this should be a delete
    post "/activities/start", to: "activities#start"
    post "/activities/end", to: "activities#end"
  end
end
