@Override
public void deleteBindMiniRelation(Long id) {
    // 创建 LambdaQueryWrapper，设置查询条件
    LambdaQueryWrapper<EggDeviceEntity> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.eq(EggDeviceEntity::getType, 6);
    queryWrapper.eq(EggDeviceEntity::getId, id);

    // 直接更新找到的记录，将parentDevice设置为null
    this.lambdaUpdate()
        .set(EggDeviceEntity::getParentDevice, null)
        .eq(EggDeviceEntity::getType, 6)
        .eq(EggDeviceEntity::getId, id)
        .update();
} 