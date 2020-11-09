"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(function () {
  var _ajax_var = ajax_var,
      nonce = _ajax_var.nonce;
  var _ajax_var2 = ajax_var,
      lang = _ajax_var2.lang,
      searchUrl = _ajax_var2.searchUrl;
  lang = lang ? "".concat(lang, "/") : '';
  searchUrl = "".concat(searchUrl.slice(0, searchUrl.indexOf('wp-json'))).concat(lang).concat(searchUrl.slice(searchUrl.indexOf('wp-json')));
  var headers = new Headers({
    'Content-Type': 'applications/json',
    'X-WP-Nonce': nonce
  });
  var fetchOptions = {
    method: 'get',
    headers: headers,
    credentials: 'same-origin'
  };
  var searchInput = document.querySelector('.artist-search');
  var artistsContainer = document.querySelector('.artists__container');
  var artworksContainer = document.querySelector('.artworks__container');
  var artworkGallery = document.querySelector('.artwork__gallery');
  var initialsLinks = document.querySelectorAll('.initial-link');
  initialsLinks.forEach(function (initial) {
    var moveTo = new MoveTo({
      tolerance: 10,
      duration: 500,
      easing: 'easeOutQuart',
      container: artistsContainer
    });
    initial.addEventListener('click', function () {
      var target = initial.dataset.target;
      var scrollTo = document.querySelector("[data-initial=".concat(target.toLowerCase(), "]"));
      moveTo.move(scrollTo);
    });
  });
  /**
   * Displays info and artworks from the artist on which the user clicked
   *
   * @param {Event} event - The event which triggers the function
   * @param {Object} ajax - data object from PHP
   * @param {HTMLElement} target - HTML target element
   * @param {Object} options - Request options object
   */

  var artistArtworks = function artistArtworks(event, ajax, target, options) {
    event.preventDefault();
    var artist = event.target.dataset.artist;
    var artworksUrl = ajax.artworkUrl + artist + '&order=asc&orderby=slug';
    var artistUrl = "".concat(ajax.artistUrl, "/").concat(artist);
    var fixedArtworksUrl = "".concat(artworksUrl.slice(0, artworksUrl.indexOf('wp-json'))).concat(lang).concat(artworksUrl.slice(artworksUrl.indexOf('wp-json')));
    var fixedArtistUrl = "".concat(artistUrl.slice(0, artistUrl.indexOf('wp-json'))).concat(lang).concat(artistUrl.slice(artistUrl.indexOf('wp-json')));
    target.innerHTML = ''; // empty artworks container

    target.classList.add('loading'); // Fetch artworks asynchronously

    asyncFetch(fixedArtworksUrl, options).then(function (jsonResponse) {
      var html = artworksList(jsonResponse);
      target.insertAdjacentHTML('beforeend', html);
      var artworkList = document.querySelectorAll('.artwork-list .artwork');
      var artworksThumbnails = document.querySelectorAll('.artwork__thumbnail a'); // Toggles artwork info visibility

      artworkList.forEach(function (artwork) {
        var stuff = artwork.querySelector('.artwork__stuff');
        var artworkTitle = artwork.querySelector('.artwork__title');
        artworkTitle.addEventListener('click', function (artworkEvent) {
          artworkEvent.preventDefault();
          stuff.classList.toggle('visible');
        });
      }); // Shows artwork detailed images when thumbnail is clicked

      artworksThumbnails.forEach(function (thumbnail) {
        thumbnail.addEventListener('click', function (thumbnailEvent) {
          thumbnailEvent.preventDefault();
          var artwork = thumbnailEvent.currentTarget.dataset.artwork;

          if (jsonResponse.some(function (item) {
            return item.id === parseInt(artwork);
          })) {
            // console.log(slider);
            // const autoplay = function(){
            var autoplay = /*#__PURE__*/function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return wait(4000);

                      case 2:
                        slider.move();
                        requestAnimationFrame(autoplay);

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function autoplay() {
                return _ref.apply(this, arguments);
              };
            }();

            // console.log(jsonResponse);
            artworkGallery.innerHTML = '';
            var slidesContainer = document.createElement('div');
            slidesContainer.classList.add('slides');
            artworkGallery.insertAdjacentElement('afterbegin', slidesContainer);
            var slides = jsonResponse.filter(function (item) {
              return item.id === parseInt(artwork);
            })[0].artwork_image_gallery;
            slides.forEach(function (slide) {
              return slidesContainer.insertAdjacentHTML('beforeend', "\n\t\t\t\t\t\t\t<div class=\"slide\">\n\t\t\t\t\t\t\t\t".concat(slide, "\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t"));
            });
            artworkGallery.insertAdjacentHTML('beforeend', "\n\t\t\t\t\t\t\t<div class=\"controls\">\n\t\t\t\t\t\t\t\t<button class=\"goToPrev\">\u2190 Prev</button>\n\t\t\t\t\t\t\t\t<button class=\"goToNext\">Next \u2192</button>\n\t\t\t\t\t\t\t</div>");
            var slider = new Slider(artworkGallery);
            requestAnimationFrame(autoplay); // }
            // slidesContainer.insertAdjacentHTML('afterbegin', jsonResponse.filter((item) => item.id === parseInt(artwork))[ 0 ].artwork_image_gallery.join('\n'));
          }
        });
      });
    }).then(function () {
      return target.classList.remove('loading');
    }); // Fetch artist info asynchronously

    asyncFetch(fixedArtistUrl, options).then(function (jsonResponse) {
      var html;
      var name = jsonResponse.name,
          description = jsonResponse.description;

      if (_typeof(jsonResponse) === 'object') {
        html = "\n\t\t\t\t<h2>".concat(name, "</h2>\n\t\t\t\t<p>").concat(description, "</p>\n\t\t\t\t");
      } else {
        html = artist;
      }

      target.insertAdjacentHTML('afterbegin', html);
    });
  };
  /**
   * Displays a list of Artists filtered by name
   *
   * @param {string} url - The REST endpoint url
   * @param {Object} options - Request options object
   * @param {HTMLElement} target - HTML target element
   */


  var artistsList = function artistsList(url, options, target) {
    target.classList.add('loading');
    asyncFetch(url, options).then(function (jsonResponse) {
      target.innerHTML = '';

      if (Array.isArray(jsonResponse)) {
        // Create an a array of unique 'order name' initials
        var initialsSet = new Set(jsonResponse.map(function (item) {
          return item.order[0];
        }));

        var initials = _toConsumableArray(initialsSet); // Create a group for every initial


        initials.forEach(function (initial) {
          var group = document.createElement('div');
          group.classList.add('artists-group');
          group.dataset.initial = initial;
          group.insertAdjacentHTML('afterbegin', "\n\t\t\t\t\t\t\t<span class=\"artists-group__label\">".concat(initial, "</span>\n\t\t\t\t\t\t")); // Group every artist by its initial

          jsonResponse.filter(function (item) {
            return item.order[0] === initial;
          }).forEach(function (item) {
            var button = document.createElement('button');
            button.dataset.artist = item.term_id;
            button.classList.add('artist__button');
            button.classList.add('inactive');
            button.insertAdjacentText('afterbegin', item.name); // Display artist info and its artworks

            button.addEventListener('click', function (event) {
              artistArtworks(event, ajax_var, artworksContainer, fetchOptions);
            });
            group.insertAdjacentElement('beforeend', button);
          });
          target.insertAdjacentElement('beforeend', group);
        });
      } else {
        target.innerHTML = jsonResponse;
      }
    }).then(function () {
      return target.classList.remove('loading');
    });
  }; // Show artists on load


  artistsList(searchUrl, fetchOptions, artistsContainer); //

  searchInput.addEventListener('keyup', function () {
    artistsList("".concat(searchUrl, "/").concat(searchInput.value), fetchOptions, artistsContainer);
  });
})();
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function artworksList(artworks) {
  var html = '';

  if (_typeof(artworks) === 'object') {
    html += '<ul class="artwork-list">';
    artworks.forEach(function (element) {
      var _element$artwork_tech = element.artwork_techniques,
          featuredTechniques = _element$artwork_tech.featured_techniques,
          otherTechniques = _element$artwork_tech.other_techniques;
      html += "\n\t\t\t<li class=\"artwork\" key=\"artwork-".concat(element.slug, "\">\n\t\t\t\t<div class=\"artwork__title\"><a href=\"").concat(element.link, "\">").concat(element.title.rendered, "</a></div>\n\t\t\t\t<div class=\"artwork__stuff\">\n\t\t\t\t\t").concat(element.artwork_image_src ? "<div class=\"artwork__thumbnail\"><a href=\"".concat(element.link, "\" data-artwork=\"").concat(element.id, "\">").concat(element.artwork_image_src, "</a></div>") : '', "\n\t\t\t\t\t<div class=\"artwork__info\">").concat(element.bp_artwork_year, "</div>\n\t\t\t\t\t<div class=\"artwork__info\">").concat(element.bp_artwork_condition, "</div>\n\t\t\t\t\t<div class=\"artwork__info\">").concat(element.bp_artwork_copy, "</div>\n\t\t\t\t\t<div class=\"artwork__info\">").concat(element.bp_artwork_paper, "</div>\n\t\t\t\t\t<div class=\"artwork__info\">").concat(element.bp_artwork_size, "</div>\n\t\t\t\t\t").concat(element.artwork_loan ? "<div class=\"artwork__info\">".concat(element.artwork_loan, "</div>") : '', "\n\t\t\t\t\t").concat(element.artwork_sale ? "<div class=\"artwork__info\">".concat(element.artwork_sale, "</div>") : '', "\n\t\t\t\t\t<div class=\"artwork__techniques\">\n\t\t\t\t\t\t").concat(featuredTechniques.map(function (technique) {
        return "<a href=\"".concat(technique[1], "\">").concat(technique[0], "</a>");
      }).join('\n'), "\n\t\t\t\t\t\t").concat(otherTechniques && "<span>".concat(otherTechniques, "</span>"), "\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"artwork__info\">").concat(element.bp_artwork_info, "</div>\n\t\t\t\t</div>\n\t\t\t</li>\n\t\t\t");
    });
    html += '</ul>';
  } else {
    html = artworks;
  }

  return html;
}
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function asyncFetch(_x, _x2) {
  return _asyncFetch.apply(this, arguments);
}

function _asyncFetch() {
  _asyncFetch = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, options) {
    var response, responseJSON;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch(url, options);

          case 2:
            response = _context.sent;
            responseJSON = response.ok ? response.json() : '';
            return _context.abrupt("return", responseJSON);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _asyncFetch.apply(this, arguments);
}