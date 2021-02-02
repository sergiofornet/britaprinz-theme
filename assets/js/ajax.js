"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  var _ajax_var = ajax_var,
      nonce = _ajax_var.nonce;
  var _ajax_var2 = ajax_var,
      lang = _ajax_var2.lang,
      searchUrl = _ajax_var2.searchUrl,
      artistId = _ajax_var2.artistId;
  console.log(ajax_var);
  var headers = new Headers({
    'Content-Type': 'application/json',
    'X-WP-Nonce': nonce
  });
  var fetchOptions = {
    method: 'get',
    headers: headers,
    credentials: 'same-origin'
  };
  var searchInput = document.querySelector('.artist-search');
  var artistsList = document.querySelector('.artists__list');
  var groupObserver = new IntersectionObserver(initialsCallback, {
    rootMargin: '0px 0px -85% 0px',
    root: artistsList,
    threshold: 0.5
  });
  var artworks = document.querySelector('.artworks');
  var artworkGallery = document.querySelector('.artwork-gallery');
  artworkGallery.querySelector('.artwork-gallery__close button').addEventListener('click', function () {
    return artworkGallery.classList.toggle('hidden');
  });
  var artworkSlider = artworkGallery.querySelector('.artwork-gallery__slider');
  var initialButtons = document.querySelectorAll('.initial__button'); // Scroll to selected initial group on click

  initialButtons.forEach(function (initial) {
    var moveTo = new MoveTo({
      tolerance: 10,
      duration: 500,
      easing: 'easeOutQuart',
      container: artistsList
    });
    initial.addEventListener('click', function () {
      var target = initial.dataset.target;
      var scrollTo = document.querySelector("[data-initial=".concat(target.toLowerCase(), "]"));
      moveTo.move(scrollTo);
    });
  });
  /**
   * Callback function for groupObserver observer
   * Highlights the intersecting group's initial on initials container
   *
   * @param {Array} entries - Array of intersection entries
   */

  function initialsCallback(entries) {
    entries.forEach(function (entry) {
      var initial = document.querySelector(".initial__button[data-target*=".concat(entry.target.dataset.initial, "]"));

      if (entry.intersectionRatio >= 0.5) {
        initial.classList.add('active');
      } else {
        initial.classList.remove('active');
      }
    });
  }
  /**
   * Displays info and artworks from the artist on which the user clicked
   *
   * @param {Event} event - The event which triggers the function
   * @param {Object} ajax - data object from PHP
   * @param {HTMLElement} target - HTML target element
   * @param {Object} options - Request options object
   * @param {number} id - An optional artist id
   */


  var artistArtworks = function artistArtworks(event, ajax, target, options) {
    var id = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
    console.log(ajax);
    var artist;

    if (id) {
      artist = id;
    } else {
      event.preventDefault();
      artist = event.target.dataset.artist;
    }

    var artworksUrl = "".concat(ajax.artworkUrl, "?artist=").concat(artist, "&order=asc&orderby=slug");
    var artistUrl = "".concat(ajax.artistUrl, "/").concat(artist);
    target.innerHTML = ''; // empty artworks container

    target.classList.add('loading'); // Fetch artworks asynchronously

    asyncFetch(artworksUrl, options).then(function (jsonResponse) {
      console.log(artworksUrl);
      var html = artworksList(jsonResponse);
      target.insertAdjacentHTML('beforeend', html);
      var artworkList = document.querySelectorAll('.artworks__list .artwork');
      var artworksThumbnails = document.querySelectorAll('.artwork__thumbnail a'); // Toggles artwork info visibility

      artworkList.forEach(function (artwork) {
        var artworkInfo = artwork.querySelector('.artwork__info');
        var artworkTitle = artwork.querySelector('.artwork__title');
        artworkTitle.addEventListener('click', function (artworkEvent) {
          artworkInfo.classList.toggle('visible');
        });
      }); // Shows artwork detailed images when thumbnail is clicked

      artworksThumbnails.forEach(function (thumbnail) {
        thumbnail.addEventListener('click', function (thumbnailEvent) {
          thumbnailEvent.preventDefault();
          artworkGallery.classList.toggle('hidden');
          var artwork = thumbnailEvent.currentTarget.dataset.artwork;

          if (jsonResponse.some(function (item) {
            return item.id === parseInt(artwork);
          })) {
            artworkSlider.innerHTML = '';
            var slidesContainer = document.createElement('div');
            slidesContainer.classList.add('slides');
            artworkSlider.insertAdjacentElement('afterbegin', slidesContainer);
            var slides = jsonResponse.filter(function (item) {
              return item.id === parseInt(artwork);
            })[0].artwork_image_gallery;
            slides.forEach(function (slide) {
              return slidesContainer.insertAdjacentHTML('beforeend', "\n\t\t\t\t\t\t\t<div class=\"slide\">\n\t\t\t\t\t\t\t\t".concat(slide, "\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t"));
            });
            artworkSlider.insertAdjacentHTML('beforeend', "\n\t\t\t\t\t\t\t<div class=\"controls\">\n\t\t\t\t\t\t\t\t<button class=\"previous-slide\">\u2190</button>\n\t\t\t\t\t\t\t\t<button class=\"next-slide\">\u2192</button>\n\t\t\t\t\t\t\t</div>");
            var slider = new Slider(artworkSlider, true); // slidesContainer.insertAdjacentHTML('afterbegin', jsonResponse.filter((item) => item.id === parseInt(artwork))[ 0 ].artwork_image_gallery.join('\n'));
          }
        });
      });
    }).then(function () {
      return target.classList.remove('loading');
    }); // Fetch artist info asynchronously

    asyncFetch(artistUrl, options).then(function (jsonResponse) {
      console.log(artistUrl);
      var html;
      var name = jsonResponse.name,
          artistBio = jsonResponse.artist_bio;

      if (_typeof(jsonResponse) === 'object') {
        html = "\n\t\t\t\t<div class=\"artworks__artist\">\n\t\t\t\t\t<h2 class=\"artist__name\">".concat(name, "</h2>\n\t\t\t\t\t").concat(artistBio ? "<div class=\"artist__bio\">".concat(artistBio, "</div>") : '', "\n\t\t\t\t</div>\n\t\t\t\t");
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
   * @param {string|null} currentLang - Current language on the front end. Needed to fix REST URLs when user is logged in. 🤷 blame WPML developers, not me
   */


  var filterArtists = function filterArtists(url, options, target, currentLang) {
    var fixedUrl = "".concat(currentLang ? "".concat(url, "?lang=").concat(currentLang) : "".concat(url));
    console.log(fixedUrl);
    target.classList.add('loading');
    asyncFetch(fixedUrl, options).then(function (jsonResponse) {
      target.innerHTML = '';

      if (Array.isArray(jsonResponse)) {
        // Create an a array of unique 'order name' initials
        // temporary fix
        // trimmed order field whitespaces & resorted
        // must sanitize fields on backend instead
        var initialsSet = new Set(jsonResponse.map(function (item) {
          return item.order.trim()[0].toLowerCase();
        }).sort());

        var initials = _toConsumableArray(initialsSet); // Create a group for every initial


        initials.forEach(function (initial) {
          var group = document.createElement('div');
          group.classList.add('artists-group');
          group.dataset.initial = initial;
          group.insertAdjacentHTML('afterbegin', "\n\t\t\t\t\t\t\t<span class=\"artists-group__label\">".concat(initial, "</span>\n\t\t\t\t\t\t")); // Group every artist by its initial

          jsonResponse.filter(function (item) {
            return item.order.trim()[0].toLowerCase() === initial;
          }).forEach(function (item) {
            var button = document.createElement('button');
            button.dataset.artist = item.term_id;
            button.classList.add('artist__button');
            button.classList.add('inactive');
            button.insertAdjacentText('afterbegin', item.name); // Display artist info and its artworks

            button.addEventListener('click', function (event) {
              if (event.currentTarget.classList.contains('inactive')) {
                document.querySelector('.artist__button.active') && document.querySelector('.artist__button.active').classList.replace('active', 'inactive');
                artistArtworks(event, ajax_var, artworks, fetchOptions);
                event.currentTarget.classList.replace('inactive', 'active');
              } else {
                event.currentTarget.classList.replace('active', 'inactive');
                artworks.innerHTML = '';
              }
            });
            group.insertAdjacentElement('beforeend', button);
          });
          target.insertAdjacentElement('beforeend', group);
          groupObserver.observe(group);
        });
      } else {
        target.innerHTML = jsonResponse;
      }
    }).then(function () {
      return target.classList.remove('loading');
    });
  }; // Show artists on load


  filterArtists(searchUrl, fetchOptions, artistsList, lang);

  if (artistId) {
    artistArtworks(null, ajax_var, artworks, fetchOptions, artistId);
  } // Filter artists by input value


  searchInput.addEventListener('keyup', function () {
    filterArtists("".concat(searchUrl, "/").concat(searchInput.value), fetchOptions, artistsList, lang);
  });
})();
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function artworksList(artworks) {
  var html = '';

  if (_typeof(artworks) === 'object') {
    html += '<ul class="artworks__list">';
    artworks.forEach(function (element) {
      var _element$artwork_tech = element.artwork_techniques,
          featuredTechniques = _element$artwork_tech.featured_techniques,
          otherTechniques = _element$artwork_tech.other_techniques;
      html += "\n\t\t\t<li class=\"artwork\" key=\"artwork-".concat(element.slug, "\">\n\t\t\t\t<button class=\"artwork__title\">").concat(element.title.rendered, "</button>\n\t\t\t\t<div class=\"artwork__info\">\n\t\t\t\t\t").concat(element.artwork_image_src ? "<div class=\"artwork__thumbnail\"><a href=\"".concat(element.link, "\" data-artwork=\"").concat(element.id, "\">").concat(element.artwork_image_src, "</a></div>") : '', "\n\t\t\t\t\t<div class=\"artwork__year\">").concat(element.bp_artwork_year, "</div>\n\t\t\t\t\t<div class=\"artwork__copy\">").concat(element.bp_artwork_copy, "</div>\n\t\t\t\t\t").concat(element.bp_artwork_size_image && "<div class=\"artwork__size-image\">".concat(element.bp_artwork_size_image, "</div>"), "\n\t\t\t\t\t<div class=\"artwork__size-sheet\">").concat(element.bp_artwork_size, "</div>\n\t\t\t\t\t<div class=\"artwork__paper\">").concat(element.bp_artwork_paper, "</div>\n\t\t\t\t\t<div class=\"artwork__condition\">").concat(element.bp_artwork_condition, "</div>\n\t\t\t\t\t").concat(element.artwork_info ? "<div class=\"artwork__description\">".concat(element.artwork_info, "</div>") : '', "\n\t\t\t\t\t<div class=\"artwork__techniques\">\n\t\t\t\t\t\t").concat(featuredTechniques.map(function (technique) {
        return "<a class=\"technique\" href=\"".concat(technique[1], "\">").concat(technique[0], "</a>");
      }).join('\n'), "\n\t\t\t\t\t\t").concat(otherTechniques && "<span>".concat(otherTechniques, "</span>"), "\n\t\t\t\t\t</div>\n\t\t\t\t\t").concat(element.artwork_loan ? "<div class=\"artwork__loan\">".concat(element.artwork_loan, "</div>") : '', "\n\t\t\t\t\t").concat(element.artwork_sale ? "<div class=\"artwork__sale\">".concat(element.artwork_sale, "</div>") : '', "\n\t\t\t\t</div>\n\t\t\t</li>\n\t\t\t");
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