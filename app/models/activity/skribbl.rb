class Activity::Skribbl < Activity
  class << self
    def display_name
      "Skribbl.io"
    end

    def max_users
      8
    end
  end
end
