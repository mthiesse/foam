E('b').c('bold', E('br')).write(document);

E('b').c(
  'color: ',
  E('font').attr('color', 'red').c('red', E('br'))).write(document);

var e = E('font').c('text');
console.log('id: ', e.id);

e.write(document);

e.attr('color', 'orange');

e.style('fontWeight', 'bold');
e.style('fontSize', '32pt');

e.on('click', function() { console.log('clicked'); });
