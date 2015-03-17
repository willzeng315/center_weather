import urllib
i=10
while i<50:
    urllib.urlretrieve("http://www.cwb.gov.tw/V7/symbol/weather/gif/day/"+str(i)+".gif",str(i)+".gif")
    i+=1
