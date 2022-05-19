import random
import time

random.seed(time.time())

# ilk kullanıcı sonraki bilgisayar
durum = {
    "taş": {"taş": "beraber", "kağıt": "kaybet", "makas": "kazan"},
    "kağıt": {"taş": "kazan", "kağıt": "beraber", "makas": "kaybet"},
    "makas": {"taş": "kaybet", "kağıt": "kazan", "makas": "beraber"},
}
secenek = ["taş", "kağıt", "makas"]
print("Turkish luck game")
kazanılan = 0
kaybedilen = 0
beraber = 0
for x in range(5):
    kulanıcı = input("taş kağıt makas: ")
    kazkaybet = durum[kulanıcı][random.choice(secenek)]  # type: ignore
    if kazkaybet == "beraber":
        print("beraber")
        beraber += 1
    elif kazkaybet == "kaybet":
        print("kaybettin")
        kaybedilen += 1
    elif kazkaybet == "kazan":
        print("kazandın")
        kazanılan += 1

print("bitti bu oyun")
print(f"skor kazanılan:{kazanılan} kaybedilen:{kaybedilen} berabere:{beraber}")
