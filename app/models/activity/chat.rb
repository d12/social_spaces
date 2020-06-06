class Activity::Chat < BaseActivity
  class << self
    def display_name
      "Chat"
    end

    def max_users
      5
    end
  end
end
