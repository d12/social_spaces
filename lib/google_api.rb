require 'google/apis/calendar_v3'
require 'google/api_client/client_secrets'

class GoogleAPI
  class << self
    def generate_meet_url(user)
      auth = Signet::OAuth2::Client.new(
        token_credential_uri: 'https://oauth2.googleapis.com/token',
        client_id: ENV["GOOGLE_CLIENT_ID"],
        client_secret: ENV["GOOGLE_CLIENT_SECRET"],
        refresh_token: user.refresh_token
      )

      # Don't refresh token if there's more than 30 seconds remaining before it expires.
      if(Time.at(user.expires_at) - Time.now < 30)
        auth.fetch_access_token!
        user.update(token: auth.access_token, expires_at: auth.expires_at)
      end

      service = Google::Apis::CalendarV3::CalendarService.new
      service.authorization = auth

      event = {
        "end": {
          "date_time": "2025-01-01T09:30:00-07:00"
        },
        "start": {
          "date_time": "2025-01-01T09:00:00-07:00"
        },
        "conference_data": {
          "conference_id": "hangoutsMeet",
          "create_request": {
            "request_id": "1",
            "conference_solution_key": {
              "type": "hangoutsMeet"
            }
          }
        }
      }

      # TODO: error handling
      # TODO: Delete the calendar event lol
      res = service.insert_event(user.email, event, conference_data_version: 1, send_notifications: false, send_updates: "none")
      res.hangout_link
    end
  end
end
