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
  let $dropDown = $('select');

  let alreadyThere = false;
  let keyword = this.keyword;

  $dropDown.children().each(function() {
    if (this.value === keyword){
      alreadyThere = true;
    }
  });

  if (alreadyThere === false) {
    const $newOption = $('<option></option>');

    $newOption.attr('value', this.keyword);
    $newOption.text(this.keyword);

    $dropDown.append($newOption);
  }
};
HornedAnimal.filterAnimals = function(selected){
  $('#photo-template').siblings().remove();
  HornedAnimal.allAnimals.forEach(animal => {
    if(selected === animal.keyword){
      animal.renderWithJquery();
    }
    else if(selected === 'default'){
      animal.renderWithJquery();
    }
  });
};
HornedAnimal.getAllAnimals = function(){
  $.get('/data/page-1.json', 'json').then(animalJSON => {
    animalJSON.forEach(animal => {
      new HornedAnimal(animal.image_url, animal.title, animal.description, animal.keyword, animal.horns);
    });

    this.allAnimals.forEach(animal => {
      animal.addToDropdown();
    });

    $('select').change(function() {
      let selected = this.value;
      HornedAnimal.filterAnimals(selected);
    });
    HornedAnimal.filterAnimals('default');
  });

  //TODO: build render function
};

HornedAnimal.getAllAnimals();



