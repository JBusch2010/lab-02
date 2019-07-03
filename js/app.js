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
  const $newAnimal = $('<section></section');

  const animalTemplateHTML = $('#photo-template').html();

  $newAnimal.html(animalTemplateHTML);

  $newAnimal.find('h2').text(this.title);
  $newAnimal.find('img').attr('src', this.image_url);
  $newAnimal.find('p').text(this.description);

  $('main').append($newAnimal);
};


HornedAnimal.getAllAnimals = function(){
  $.get('../data/page-1.json', 'json').then(animalJSON => {
    animalJSON.forEach(animal => {
      new HornedAnimal(animal.image_url, animal.title, animal.description, animal.keyword, animal.horns);
    });
    //TODO: build render function

    this.allAnimals.forEach(animal => {
      animal.renderWithJquery();
    });
  });
};

HornedAnimal.getAllAnimals();





