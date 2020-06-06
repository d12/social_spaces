Rails.application.routes.draw do
  root "activities#index"

  resource :activities, only: [:index]

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get "/auth/:provider/callback" => "sessions#create"
  delete "/logout" => "sessions#destroy"
end
