Rails.application.routes.draw do
  root "groups#index"

  resource :groups, only: [:index, :create]

  # Authentication
  get "/auth/:provider/callback" => "sessions#create"
  delete "/logout" => "sessions#destroy"
end
