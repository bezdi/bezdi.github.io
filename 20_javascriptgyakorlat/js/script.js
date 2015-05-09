console.log('elindultunk');

var haromszogek = document.querySelectorAll('.haromszog');

var sebessegek = [0.5, 0.3, 0.5];

var kezdoertekek = [];
for (var i = 0; i < haromszogek.length; i = i + 1) {

    var haromszog = haromszogek[i];

    var informaciok = haromszog.getBoundingClientRect();

    kezdoertekek[i] = informaciok.top;
}


console.log(haromszogek);

function szkrolloztak() {
  console.log(haromszogek);
  for (var i = 0; i < haromszogek.length; i = i + 1) {

    var haromszog = haromszogek[i];
    var kezdoertek = kezdoertekek[i];
    var sebesseg = sebessegek[i];

    haromszog.style.top = kezdoertek + document.body.scrollTop * sebesseg + 'px';
  }
}

document.addEventListener('scroll', szkrolloztak);
