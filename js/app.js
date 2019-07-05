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

HornedAnimal.prototype.renderWithHandlebars = function(){
  const source = $('#photo-template').html();
  const template = Handlebars.compile(source);
  const newHtml = template(this);
  console.log(newHtml);

  $('main').append(newHtml);
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
      animal.renderWithHandlebars();
    }
    else if(selected === 'default'){
      animal.renderWithHandlebars();
    }
  });
};

HornedAnimal.makeNewHornedAnimal = function(animalJSON){
  animalJSON.forEach(animal => {
    new HornedAnimal(animal.image_url, animal.title, animal.description, animal.keyword, animal.horns);
  });
};



HornedAnimal.getAllAnimals = function(){

  $.get('data/page-1.json', 'json').then(animalJSON => {

    this.makeNewHornedAnimal(animalJSON);

    $.get('data/page-2.json', 'json').then(moreAnimalJSON => {

      this.makeNewHornedAnimal(moreAnimalJSON);

      this.allAnimals.forEach(animal => {
        animal.addToDropdown();
      });

      $('select').change(function() {
        let selected = this.value;
        HornedAnimal.filterAnimals(selected);
      });
      HornedAnimal.filterAnimals('default');

    });

  });

};

HornedAnimal.getAllAnimals();



