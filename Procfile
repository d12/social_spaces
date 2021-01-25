web: [[ "$ANYCABLE_DEPLOYMENT" == "true" ]] && bundle exec anycable --server-command="anycable-go" ||  bundle exec puma -t 5:5 -p ${PORT:-3000} -e ${RACK_ENV:-development}
activity_thread_manager: [[ "$ANYCABLE_DEPLOYMENT" == "true" ]] && echo "Skip activity thread manager" || bundle exec bin/activity-thread-manager
release: [[ "$ANYCABLE_DEPLOYMENT" == "true" ]] && echo "Skip release script" || bundle exec rake db:migrate
