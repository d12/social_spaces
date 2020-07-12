web: bundle exec puma -t 5:5 -p ${PORT:-3000} -e ${RACK_ENV:-development}
activity_thread_manager: bundle exec bin/activity-thread-manager
release: bundle exec rake db:migrate
