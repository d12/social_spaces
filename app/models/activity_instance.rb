class ActivityInstance < ApplicationRecord
  belongs_to :group
  enum status: { awaiting_activity_thread: 0, ongoing: 1, finished: 2 }

  before_create :initialize_storage

  def send_message(data)
    activity_klass.message(self.reload, data)
  end

  def client_bootstrap_data
    activity_klass.client_bootstrap_data(self.reload)
  end

  private

  def initialize_storage
    self.state ||= activity_klass.initialize_storage
  end

  def activity_klass
    "Activity::#{activity.camelize}".constantize
  end
end
