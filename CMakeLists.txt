cmake_minimum_required(VERSION 3.11)
project(FoodOrderingSystem)

# Set C++ standard
set(CMAKE_CXX_STANDARD 28)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find SQLite3
find_package(SQLite3 REQUIRED)

# Include directories
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/include)
include_directories(${SQLITE3_INCLUDE_DIRS})

# Source files
set(SOURCES
    src/main.cpp
    src/database.cpp
    src/server.cpp
)

# Create executable
add_executable(food_ordering_system ${SOURCES})

# Link libraries
target_link_libraries(food_ordering_system PRIVATE ${SQLITE3_LIBRARIES})

# Compiler flags
if(MSVC)
    target_compile_options(food_ordering_system PRIVATE /W4)
else()
    target_compile_options(food_ordering_system PRIVATE -Wall -Wextra -Wpedantic)
endif()

# Output directory
set_target_properties(food_ordering_system PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
)

message(STATUS "Build configuration:")
message(STATUS "  C++ Standard: ${CMAKE_CXX_STANDARD}")
message(STATUS "  SQLite3: ${SQLITE3_INCLUDE_DIRS}")
message(STATUS "  Build Type: ${CMAKE_BUILD_TYPE}")
