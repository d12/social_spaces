Rails.application.routes.draw do
  root "groups#index"

  resources :groups, only: [:index, :create]
  get "join/:group_key", to: "groups#join", as: "join_group" # TODO: This shouldn't be GET.
  delete "leave_group", to: "groups#leave", as: "leave_group"

  resources :activities, only: [:index]

  # Authentication
  get "/auth/:provider/callback" => "sessions#create"
  delete "/logout" => "sessions#destroy"
end
