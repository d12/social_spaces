class Activity
  class NotSubclassedError < StandardError; end

  class << self
    def display_name
      raise NotSubclassedError
    end

    def max_users
      raise NotSubclassedError
    end

    # Activity::ChatGame -> chat_game
    def slug
      self.name.demodulize.underscore
    end

    def from_slug(slug)
      "Activity::#{slug.classify}".constantize
    rescue NameError
      nil
    end
  end
end
