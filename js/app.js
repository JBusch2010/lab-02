'use strict';
/*global $ */

const HornedAnimal = function(image_url, title, description, keyword, horns, file) {
  this.image_url = image_url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
  this.file = file;
  HornedAnimal.allAnimals.push(this);
};

HornedAnimal.allAnimals = [];

HornedAnimal.prototype.renderWithHandlebars = function(){

  const source = $('#photo-template').html();
  const template = Handlebars.compile(source);

  const newSectionHTML = template(this);

  $('.photo-template-placeholder').append(newSectionHTML);
};

HornedAnimal.prototype.renderWithHandlebars = function(){
  const source = $('#photo-template').html();
  const template = Handlebars.compile(source);
  const newHtml = template(this);
  $('main').append(newHtml);


};

HornedAnimal.prototype.addToDropdown = function(){
  const source = $('#dropdown-template').html();
  const template = Handlebars.compile(source);

  const newDropdown = template(this);

  let alreadyThere = false;
  let keyword = this.keyword;

  $('#keyword-selector').children().each(function() {
    if (this.value === keyword){
      alreadyThere = true;
    }
  });

  if (alreadyThere === false) {
    $('#keyword-selector').append(newDropdown);
  }
};

HornedAnimal.filterAnimals = function(keySelected, pageSelected, sortingSelected){
  let currentClass = $('.' + keySelected);
  let renderedAnimals = $('main').children();
  let allTitleSelected = renderedAnimals.find('h1').text();

  if (keySelected === 'default'){
    renderedAnimals.show();
  } else {
    renderedAnimals.hide();
    currentClass.show();
  }

  if (pageSelected === 'page-1') {
    $('.page-2').hide();
  } else {
    $('.page-1').hide();
  }

  if (sortingSelected === 'title'){
    renderedAnimals.sort((a,b) => {
      let aTitle = $(a).find('h1').text();
      let bTitle = $(b).find('h1').text();
      if (aTitle < bTitle) {return -1;}
      else if (aTitle > bTitle) { return 1;}
      else { return 0;}

    });
    $('main').append(renderedAnimals);
  }

  if (sortingSelected === 'number-of-horns'){
    renderedAnimals.sort((a,b) =>{
      let aHorns = parseInt($(a).find('div').attr('class'));
      let bHorns = parseInt($(b).find('div').attr('class'));
      if (aHorns < bHorns) {return -1;}
      else if (aHorns > bHorns) { return 1;}
      else { return 0;}
    });

    $('main').append(renderedAnimals);
  }

};

HornedAnimal.makeNewHornedAnimal = function(animalJSON, fileName){
  animalJSON.forEach(animal => {
    new HornedAnimal(animal.image_url, animal.title, animal.description, animal.keyword, animal.horns, fileName);
  });
};

HornedAnimal.getAllAnimals = function(){

  $.get('data/page-1.json', 'json').then(animalJSON => {

    this.makeNewHornedAnimal(animalJSON, 'page-1');

    $.get('data/page-2.json', 'json').then(moreAnimalJSON => {

      this.makeNewHornedAnimal(moreAnimalJSON, 'page-2');

      this.allAnimals.forEach(animal => {
        animal.addToDropdown();
        animal.renderWithHandlebars();
      });

      $('select').change(function() {
        let keySelected = $('#keyword-selector').val();
        let pageSelected = $('#file-selector').val();
        let sortingSelected = $('#sorting-selector').val();


        HornedAnimal.filterAnimals(keySelected, pageSelected, sortingSelected);
      });

      HornedAnimal.filterAnimals('default', 'page-1');
    });
  });

};

HornedAnimal.getAllAnimals();
