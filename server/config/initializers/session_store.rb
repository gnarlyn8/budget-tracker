Rails.application.config.session_store :cookie_store, 
  key: "_budget_app_session",
  secure: Rails.env.production?,
  httponly: true,
  same_site: :lax