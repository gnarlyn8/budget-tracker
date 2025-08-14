Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end

  post "/graphql", to: "graphql#execute"
  get "/auth/csrf", to: "csrf#show"
  post "/auth/register", to: "auth#register"
  post "/auth/login", to: "auth#login"
  delete "/auth/logout", to: "auth#logout"
  get "/auth/me", to: "auth#me"
end
