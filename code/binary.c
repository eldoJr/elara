#include<stdio.h>
#include<stdlib.h>

int linearsearch(int arr[], int size, int target) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            printf("Target %d found at index %d\n", target, i);
            return i; // Return the index of the found element
        }
    }
    printf("Target %d not found in the array\n", target);
    return -1; // Return -1 if the element is not found
}

int binarysearch(int arr[], int size, int target) {
    int left = 0;
    int right = size - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            printf("Target %d found at index %d\n", target, mid);
            return mid; // Return the index of the found element
        }
        if (arr[mid] < target) {
            left = mid + 1; // Search in the right half
        } else {
            right = mid - 1; // Search in the left half
        }
    }
    printf("Target %d not found in the array\n", target);
    return -1; // Return -1 if the element is not found
}

int main (){
    int arr[] = {2, 3, 4, 10, 40, 50, 60, 70, 80, 90};
    int size = sizeof(arr) / sizeof(arr[0]);
    int target = 10;
    
    int result = linearsearch(arr, size, target);
    if (result != -1) {
        printf("Linear Search: Element found at index %d\n", result);
    } else {
        printf("Linear Search: Element not found\n");
    }
    
    result = binarysearch(arr, size, target);
    if (result != -1) {
        printf("Binary Search: Element found at index %d\n", result);
    } else {
        printf("Binary Search: Element not found\n");
    
    return 0;
}