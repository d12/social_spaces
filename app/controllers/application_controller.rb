class ApplicationController < ActionController::Base
  include Guestable

  private

  def not_found
    render plain: "Not found", status: 404
  end

  def current_group
    @current_group ||= current_user&.group
  end
end
