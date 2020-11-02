"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  var artworksContainer = document.querySelector('.artworks__container');
  var artists = document.querySelectorAll('.artist__link');

  if (artists) {
    artists.forEach(function (artist) {
      artist.addEventListener('click', function (event) {
        event.preventDefault();
        artworksContainer.innerHTML = ''; // empty artworks container

        var headers = new Headers({
          'Content-Type': 'applications/json',
          'X-WP-Nonce': ajax_var.nonce
        });
        var lang = ajax_var.lang ? "".concat(ajax_var.lang, "/") : '';
        var artist = event.target.dataset.artist;
        var artworksUrl = ajax_var.artworkUrl + artist + "&order=asc&orderby=slug";
        var artistUrl = "".concat(ajax_var.artistUrl, "/").concat(artist);
        var fixedArtworksUrl = "".concat(artworksUrl.slice(0, artworksUrl.indexOf('wp-json'))).concat(lang).concat(artworksUrl.slice(artworksUrl.indexOf('wp-json')));
        var fixedArtistUrl = "".concat(artistUrl.slice(0, artistUrl.indexOf('wp-json'))).concat(lang).concat(artistUrl.slice(artistUrl.indexOf('wp-json')));
        console.log(fixedArtistUrl, fixedArtworksUrl);
        asyncFetch(fixedArtworksUrl, {
          method: 'get',
          headers: headers,
          credentials: 'same-origin'
        }).then(function (json_response) {
          var html;
          var artworks = json_response;
          html = artworksList(artworks);
          artworksContainer.insertAdjacentHTML('beforeend', html);
          return json_response;
        }).then(function (json_response) {
          var artworkList = document.querySelectorAll('.artwork-list .artwork');
          artworkList.forEach(function (artwork) {
            var stuff = artwork.querySelector('.artwork__stuff');
            var artworkTitle = artwork.querySelector('.artwork__title');
            artworkTitle.addEventListener('click', function (event) {
              event.preventDefault();
              stuff.classList.toggle('visible');
            });
          });
          return json_response;
        }).then(function (json_response) {
          var artworksThumbnails = document.querySelectorAll('.artwork__thumbnail a');
          var artworksGallery = document.querySelector('.artworks__gallery');
          artworksThumbnails.forEach(function (thumbnail) {
            thumbnail.addEventListener('click', function (event) {
              event.preventDefault();

              if (json_response.some(function (item) {
                return item.id === parseInt(event.currentTarget.dataset.artwork);
              })) {
                artworksGallery.innerHTML = json_response.filter(function (item) {
                  return item.id === parseInt(event.currentTarget.dataset.artwork);
                })[0].artwork_image_gallery.join('\n');
              }
            });
          });
        });
        asyncFetch(fixedArtistUrl, {
          method: 'get',
          headers: headers,
          credentials: 'same-origin'
        }).then(function (json_response) {
          var html;
          var artist = json_response;

          if (_typeof(artist) === 'object') {
            html = "\n\t\t\t\t\t\t<h2>".concat(artist.name, "</h2>\n\t\t\t\t\t\t<p>").concat(artist.description, "</p>\n\t\t\t\t\t\t");
          } else {
            html = artist;
          }

          artworksContainer.insertAdjacentHTML('afterbegin', html);
        });
      });
    });
  }
})();
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function artworksList(artworks) {
  var html = "";

  if (_typeof(artworks) === 'object') {
    html += "<ul class=\"artwork-list\">";
    artworks.forEach(function (element) {
      var _element$artwork_tech = element.artwork_techniques,
          featured_techniques = _element$artwork_tech.featured_techniques,
          other_techniques = _element$artwork_tech.other_techniques;
      html += "\n\t\t\t<li class=\"artwork\" key=\"artwork-".concat(element.slug, "\">\n\t\t\t\t<div class=\"artwork__title\"><a href=\"").concat(element.link, "\">").concat(element.title.rendered, "</a></div>\n\t\t\t\t<div class=\"artwork__stuff\">\n\t\t\t\t\t").concat(element.artwork_image_src ? "<div class=\"artwork__thumbnail\"><a href=\"".concat(element.link, "\" data-artwork=\"").concat(element.id, "\">").concat(element.artwork_image_src, "</a></div>") : '', "\n\t\t\t\t\t<div class=\"artwork__info\">").concat(element.bp_artwork_year, "</div>\n\t\t\t\t\t<div class=\"artwork__info\">").concat(element.bp_artwork_condition, "</div>\n\t\t\t\t\t<div class=\"artwork__info\">").concat(element.bp_artwork_copy, "</div>\n\t\t\t\t\t<div class=\"artwork__info\">").concat(element.bp_artwork_paper, "</div>\n\t\t\t\t\t<div class=\"artwork__info\">").concat(element.bp_artwork_size, "</div>\n\t\t\t\t\t").concat(element.artwork_loan ? "<div class=\"artwork__info\">".concat(element.artwork_loan, "</div>") : '', "\n\t\t\t\t\t").concat(element.artwork_sale ? "<div class=\"artwork__info\">".concat(element.artwork_sale, "</div>") : '', "\n\t\t\t\t\t<div class=\"artwork__techniques\">\n\t\t\t\t\t\t").concat(featured_techniques.map(function (technique) {
        return "<a href=\"".concat(technique[1], "\">").concat(technique[0], "</a>");
      }).join('\n'), "\n\t\t\t\t\t\t").concat(other_techniques && "<span>".concat(other_techniques, "</span>"), "\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"artwork__info\">").concat(element.bp_artwork_info, "</div>\n\t\t\t\t</div>\n\t\t\t</li>\n\t\t\t");
    });
    html += "</ul>";
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

            if (!response.ok) {
              _context.next = 9;
              break;
            }

            _context.next = 6;
            return response.json();

          case 6:
            _context.t0 = _context.sent;
            _context.next = 10;
            break;

          case 9:
            _context.t0 = 'Nothing found.';

          case 10:
            responseJSON = _context.t0;
            return _context.abrupt("return", responseJSON);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _asyncFetch.apply(this, arguments);
}