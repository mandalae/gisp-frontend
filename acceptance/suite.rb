require 'selenium-webdriver'
require 'rspec/expectations'
include RSpec::Matchers

def setup
  caps    = Selenium::WebDriver::Remote::Capabilities.send("firefox")
  @driver = Selenium::WebDriver.for(:remote, url: "http://0.0.0.0:4444/wd/hub", desired_capabilities: caps)
end

def teardown
  @driver.quit
end

def run
  setup
  yield
  teardown
end

run do
  @driver.get 'https://dev.gisp.org.uk'
  wait = Selenium::WebDriver::Wait.new(:timeout => 10)
  wait.until { @driver.title.start_with? "COVID-19" }
  expect(@driver.title).to eql "COVID-19 GP Information Sharing Portal"
  # @driver.save_screenshot('docker_image.png')
end
