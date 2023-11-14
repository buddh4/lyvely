# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0-alpha4] - WIP

### Fixed
- Profile layout swipe handler should be prevented in case of active scroll
- MainContainer does not have full width and scrollbar is not at the right page
- Profile layout swipe handler not active on form elements
- Drawer stack not working as expected
- Improved network error handling with auto reload

### Changed
- Mobile profile drawer is closed on route change
- Minor usability fine-tuning
- Major modularization refactoring
- Use of nx monorepo
- Updated to vue v3.3.0
- Improved profile route handling
- Major refactoring and modularization of core and feature modules
- Access by username or email
- Use of unique usernames + displayName
- Use of unique profile handle
- Many style improvements


### Added
- Implemented basic legal module
- Added Markdown support
- Implementation of Permission API
- Chat messages can be now be edited
- Router can now be extended by modules
- Major improvements of backend and frontend module system
- Added an initial view for Tasks, Habits and Milestone module
- Added a standalone mode for Tasks, Habits and Milestone module
- Added a standalone mode for Tasks, Habits and Milestone module
- Implemented Layout web API for registering layouts which can be used in routes
- Implementation of Policy API
- Implementation of Menu API
- Implementation of Feature API
- Added back to stream button
- Proper locale handling and configuration
- Automatic backup of edit store models

## [0.1.0-alpha4] - 2023-06-06

### Fixed
- Modal autofocus was not working due to new dialog
- Center modal title on mobile
- Modal may show second scrollbar in some cases of y-overflow
- Number input does not remove leading zeros
- Updates of invalid data point strategies were not detected when updating time series content entries
- Issues occurred when changing the data point configuration value type
- Fixed drawer menu viewport overflow issue
- Fixed show profile menu toggle state is reversed of small devices

### Changed
- Initially hide main container scrollbar on small devices
- Removed margins from filter navigation
- Changed the default journal config to range input

### Added
- Implemented mobile footer menu
- Implemented group profile invitations
- Added swipe gestures to open/close profile and account drawer

## [0.1.0-alpha2] - 2023-05-11
### Fixed
- User is not redirected to newly created profile
- Email is not marked as verified after registration
- Handling of avatars in multi-user profiles
- Slider navigation overflow visible
- Timer datapoint value can not be updated manually
- Datapoint timer input overflows on small devices
- Manual timer input not working if max value is set to 0
- Fixed Journal datapoint input types

### Changed
- Added missing coloring of some error alerts
- Changed PWA theme color to dark theme bg-main instead of pop
- Improved modal style on mobile
- Removed deprecated modal z-index handling
- Replaced full screen height workaround with new 100svh

### Added
- Profile user invitation
- Content create and edit store now return a promise

## [0.1.0-alpha1] - 2023-05-10
### Fixed
- Checkbox labels are not clickable
- Title of create journal displays “Edit Journal Item“
- The outline of Task calendar plan checkbox is cut
- Tasks are not sorted correct in calendar plan view
- Habit view chart overflows content on mobile
- ContentDetails add new content without respecting parentId
- Milestones are not reset on profile change

### Changed
- Change tag chooser submit label from “close” to “select”
- Improved calendar plan interval dropdown option labels
- Removed unimplemented security section from account menu

### Added
- Now new milestones can be created and assigned within the content detail view
- Enhanced accessibility by using dialog element for modals

  



  

