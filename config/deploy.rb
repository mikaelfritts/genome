default_run_options[:pty] = true

set :user, "ubuntu"
set :use_sudo, false
set :deploy_to, "/home/ubuntu/sites/genome/"
set :application, "Genome Website"
set :repository,  "git@github.com:jjosef/genome.git"
set :branch, "master"
set :deploy_via, :remote_cache
set :ssh_options, {:forward_agent => true}
set :keep_releases, 3

set :scm, :git
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

task :production do
  set :server_name, "50.16.204.228"
  role :app, server_name
  role :web, server_name
end

# if you want to clean up old releases on each deploy uncomment this:
after "deploy", "deploy:cleanup"

namespace :deploy do
  task :npm_install do
    top.upload("./api/config.js", "#{File.join(current_path, 'api', 'config.js')}")
    top.upload("./api/definitions.js", "#{File.join(current_path, 'api', 'definitions.js')}")
    run "cd #{File.join(current_path, 'api')} && npm install"
  end
  
  task :start do
    run "sudo forever start #{File.join(current_path, 'api', 'server.js')}"
  end
  
  task :restart do
    stop
    sleep 5
    start
  end
  
  task :stop do 
    run "sudo forever stopall";
  end
  after 'deploy:update_code' do
    npm_install
  end
end

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

# If you are using Passenger mod_rails uncomment this:
# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end