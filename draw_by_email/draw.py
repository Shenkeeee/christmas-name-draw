import random
import smtplib
from email.mime.text import MIMEText

# Név + email lista, email beáll.
from draw_by_email.draw_data import people, SMTP_SERVER, SMTP_PORT, SENDER_EMAIL, SENDER_PASSWORD

# Tiltott párok
forbidden_pairs = [
    ("Timi", "Máté"),
    ("Máté", "Timi")
]

# Létrehozunk egy listát a nevekből, és addig keverjük, amíg senki nem húzza saját magát,
# és a tiltott párok sem jönnek ki
names = [person["name"] for person in people]
valid = False

while not valid:
    drawn = names[:]  # másolat
    random.shuffle(drawn)
    valid = True
    for person, drawn_person in zip(people, drawn):
        if person["name"] == drawn_person:
            valid = False
            break
        if (person["name"], drawn_person) in forbidden_pairs:
            valid = False
            break


for person, drawn in zip(people, drawn):
    subject = "🎅 Karácsonyi Húzás Eredménye 🎁"
    body = f"Szia {person['name']}!\nTe őt húztad: {drawn}\nLegyen szép napod! ✨"
    msg = MIMEText(body)
    msg["From"] = SENDER_EMAIL
    msg["To"] = person["email"]
    msg["Subject"] = subject

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        print(f"Email elküldve {person['name']} ({person['email']}) részére.")
