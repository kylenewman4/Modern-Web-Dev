
# Change Log
All notable changes to our Meme Word Games project will be updated in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.3.0] - 2025-04-02
  
Added all components for Feature 5.
 
### Added
- Registration / Login / Logout implemented and connected to back4app database
- Added authentication module, where users must be logged in to access various parts of site
- Added protected routes to ensure unauthenticated users cannot access authenticated-only pages

### Changed
  
- Updated README.md
- Initial page upon loading is registration / login (auth page)
- Logout feature added throughout site
 
### Fixed


## [0.2.0] - 2025-03-07
  
Added all components for Feature 4.
 
### Added
- Added back4app database backend
- Added UML Diagram
- Added Component Tree Diagram
- Added Game object, components, services

### Changed
  
- Updated README.md
- Updated Meme object, components, services
 
### Fixed
 
- NewGame and NewMeme forms now function properly with database.
- NewGame Meme pointers will now point properly to a default option in the form.
 

## [0.1.0] - 2025-02-20
  
Added all original components for Feature 3. This update was not released on GitHub, but on codesandbox.io.
 
### Added
- Added Meme object, components, and services
- Added README.md
- Added Meme form creation
- Added Meme JSON object/parsing

### Changed
 
### Fixed
 
- NewGame and NewMeme forms now function with database.
