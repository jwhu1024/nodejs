import RPi.GPIO as GPIO, feedparser
USERNAME="lester.bandrich" 
PASSWORD="bandrich"

GPIO_PIN=23
GPIO.setmode(GPIO.BCM) 
GPIO.setwarnings(False)
GPIO.setup(GPIO_PIN, GPIO.OUT)
newmails = int(feedparser.parse("https://" + USERNAME + ":" + PASSWORD + "@mail.google.com/gmail/feed/atom")["feed"]["fullcount"])

print newmails
