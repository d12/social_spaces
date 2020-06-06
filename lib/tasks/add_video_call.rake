desc 'Adds a video call to the pool'
task :add_video_call => :environment do
  ARGV.each { |a| task a.to_sym do ; end }

  unless ARGV[1] && ARGV[2]
    puts "Usage:"
    puts "rake add_video_call <url> <number of inactive days the URL is valid for>"
    return
  end

  url, days = ARGV[1], ARGV[2]

  # This will go in the model at some point
  begin
    URI.parse(url)
  rescue URI::InvalidURIError
    puts "[Error] Please pass a valid URL"
  end

  puts "Creating video call..."
  VideoCall.create(url: url, timeout_in_days: days)

  puts "Successfully added #{url} to the pool. It will remain in the pool until it's been unused for #{days} days."
end
