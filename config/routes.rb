Rails.application.routes.draw do
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  get "/", to: "react#show", as: "react"

  namespace :api do
    get "/groups/:key", to: "groups#show"
    post "/groups/create", to: "groups#create"
    post "/groups/join", to: "groups#join"
    post "/groups/leave", to: "groups#leave" # todo, this shouldn be a delete
    post "/activities/start", to: "activities#start"
    post "/activities/end", to: "activities#end"
  end

  scope :legacy do
    get "/", to: "home#index"

    resources :groups, only: [:index, :create]
    get "join/:group_key", to: "groups#join", as: "join_group" # TODO: This shouldn't be GET.
    delete "leave_group", to: "groups#leave", as: "leave_group"

    resources :activities, only: [:index]
    post "activities/join", to: "activities#join", as: "join_activity"
    delete "leave_activity", to: "activities#leave", as: "leave_activity"
    get "play", to: "activities#show", as: "show_activity"

    # Authentication
    # get "/auth/:provider/callback" => "sessions#create"
    delete "/logout" => "sessions#destroy"

    mount ActionCable.server => '/cable'
  end

  get "*path", to: "react#show"
end
