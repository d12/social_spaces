desc 'Adds a video call to the pool'
task :add_video_call => :environment do
  ARGV.each { |a| task a.to_sym do ; end }

  unless ARGV[1] && ARGV[2]
    abort <<~ERROR
            add_video_call usage:
            rake add_video_call <url> <number of inactive days the URL is valid for>
          ERROR
  end

  url, days = ARGV[1], ARGV[2]

  puts "Creating video call..."
  VideoCall.create(url: url, timeout_in_days: days)

  puts "Successfully added #{url} to the pool. It will remain in the pool until it's been unused for #{days} days."
end
