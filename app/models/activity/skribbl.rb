class Activity::Skribbl < BaseActivity
  class << self
    def display_name
      "Skribbl.io"
    end

    def max_users
      8
    end
  end
end
