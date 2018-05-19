# DragonHack-2018
DragonHack on 2018-05-19

# Run development server

```
git clone https://github.com/MKolman/DragonHack-2018.git
cd DragonHack-2018/server
virtualenv -p $(which python3) venv
source venv/bin/activate
pip install -r requirements.txt
./manage.py runserver
```
