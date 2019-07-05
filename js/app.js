'use strict';
/*global $ */

const HornedAnimal = function(image_url, title, description, keyword, horns) {
  this.image_url = image_url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;

  HornedAnimal.allAnimals.push(this);
};

HornedAnimal.allAnimals = [];

HornedAnimal.prototype.renderWithHandlebars = function(){

  const source = $('#photo-template').html();
  const template = Handlebars.compile(source);

  const newSectionHTML = template(this);

  $('.photo-template-placeholder').append(newSectionHTML);
};



HornedAnimal.prototype.renderWithJquery = function(){
  const $newAnimal = $('<section></section>');

  const animalTemplateHTML = $('#photo-template').html();

  $newAnimal.html(animalTemplateHTML);

  $newAnimal.find('h2').text(this.title);
  $newAnimal.find('img').attr('src', this.image_url);
  $newAnimal.find('p').text(this.description);

  $('main').append($newAnimal);
};

HornedAnimal.prototype.addToDropdown = function(){
  const source = $('#dropdown-template').html();
  const template = Handlebars.compile(source);

  const newDropdown = template(this);

  let alreadyThere = false;
  let keyword = this.keyword;

  $('select').children().each(function() {
    if (this.value === keyword){
      alreadyThere = true;
    }
  });

  if (alreadyThere === false) {
    $('select').append(newDropdown);
  }
};
HornedAnimal.filterAnimals = function(selected){
  console.log($('main').children());
  let renderedAnimals = $('main').children();
  renderedAnimals.each(function(){

    if(selected === this.keyword){
      this.show();
    }
    else if(selected === 'default'){
      this.show();
    }
    else if (selected !== this.keyword){
      this.hide();
    }
  });
};
HornedAnimal.getAllAnimals = function(){

  $.get('data/page-1.json', 'json').then(animalJSON => {

    animalJSON.forEach(animal => {
      new HornedAnimal(animal.image_url, animal.title, animal.description, animal.keyword, animal.horns);
    });

    this.allAnimals.forEach(animal => {
      animal.addToDropdown();
      animal.renderWithHandlebars();
    });

    $('select').change(function() {
      let selected = this.value;
      HornedAnimal.filterAnimals(selected);
    });
    HornedAnimal.filterAnimals('default');
  });

};

HornedAnimal.getAllAnimals();
