import EmptyListComponent from 'components/list/empty.list.component';
import React, {useCallback, useMemo, forwardRef} from 'react';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';

interface BFlatListProps
  extends React.ComponentProps<typeof KeyboardAwareFlatList> {
  /**
   * Rendered when the list is loading. Can be a React Component Class, a render function, or
   * a rendered element.
   */
  ListSkeletonComponent?:
    | React.ComponentType<any>
    | React.ReactElement
    | null
    | undefined;
  isRefreshing?: boolean | null | undefined;
  keyAttribute?: string | ((item: any) => string);
}

const BFlatList = forwardRef<KeyboardAwareFlatList, BFlatListProps>(
  (
    {isRefreshing, onEndReached, ListSkeletonComponent, keyAttribute, ...props},
    ref,
  ) => {
    const getKey = useMemo(
      () =>
        typeof keyAttribute === 'function'
          ? keyAttribute
          : (o: any) => o[keyAttribute || ''],
      [keyAttribute],
    );

    const keyExtractor = useCallback(
      (item: any, index: number) =>
        (keyAttribute ? getKey(item) : index)?.toString(),
      [],
    );

    const onEndReachedHandle = useCallback(
      (value: {distanceFromEnd: number}) => {
        if (value?.distanceFromEnd < 1) {
          return;
        }
        onEndReached?.(value);
      },
      [onEndReached],
    );

    if (isRefreshing && ListSkeletonComponent) {
      // @ts-ignore
      return React.isValidElement(ListSkeletonComponent) ? (
        ListSkeletonComponent
      ) : (
        <ListSkeletonComponent />
      );
    }

    return (
      <KeyboardAwareFlatList
        ref={ref}
        keyExtractor={keyExtractor}
        ListEmptyComponent={EmptyListComponent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReachedHandle}
        {...props}
      />
    );
  },
);

export default BFlatList;
