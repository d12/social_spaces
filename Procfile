web: [[ "$ANYCABLE_DEPLOYMENT" == "true" ]] && bundle exec anycable --server-command="anycable-go" ||  bundle exec puma -t 5:5 -p ${PORT:-3000} -e ${RACK_ENV:-development}
activity_clock: [[ "$ANYCABLE_DEPLOYMENT" == "true" ]] && echo "Skip activity clock" || bundle exec bin/activity-clock
release: [[ "$ANYCABLE_DEPLOYMENT" == "true" ]] && echo "Skip release script" || bundle exec rake db:migrate
