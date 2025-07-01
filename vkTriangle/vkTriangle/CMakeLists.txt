# CMakeList.txt: vkTriangle 的 CMake 项目，在此处包括源代码并定义
# 项目特定的逻辑。
#
set(CMAKE_CXX_STANDARD 17)
#set(ENV{VULKAN_SDK} "D:/VulkanSDK/1.4.309.0")
set(ENV{VULKAN_SDK} "C:/VulkanSDK/1.3.283.0")
find_package(Vulkan REQUIRED)


#set(glfw3_DIR "D:/tool/vcpkg/packages/glfw3_x64-windows")
set(glfw3_DIR "D:/code/source/vcpkg/packages/glfw3_x64-windows")
find_package(glfw3 REQUIRED CONFIG PATHS ${glfw3_DIR} NO_DEFAULT_PATH)

# 将源代码添加到此项目的可执行文件。
add_executable (vkTriangle "vkTriangle.cpp" "vkTriangle.h")

target_include_directories(${PROJECT_NAME} PUBLIC $ENV{VULKAN_SDK}/Include)
target_link_libraries(${PROJECT_NAME} Vulkan::Vulkan)

# 链接引用头文件
#target_include_directories(vkTriangle PRIVATE D:/tool/vcpkg/packages/glfw3_x64-windows/include)
target_include_directories(vkTriangle PRIVATE D:/code/source/vcpkg/packages/glfw3_x64-windows/include)

# 链接glfw3.lib库目录
#target_link_directories(vkTriangle PRIVATE D:/tool/vcpkg/packages/glfw3_x64-windows/lib)
target_link_directories(vkTriangle PRIVATE D:/code/source/vcpkg/packages/glfw3_x64-windows/lib)

# 链接 glfw
target_link_libraries(vkTriangle glfw)

if (CMAKE_VERSION VERSION_GREATER 3.12)
  set_property(TARGET vkTriangle PROPERTY CXX_STANDARD 20)
endif()

# TODO: 如有需要，请添加测试并安装目标。
