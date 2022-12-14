/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: CGTRAINING (https://sketchfab.com/1halfstone)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/yoyogi-stadium-e9cd7ac90c9a474d8ba79b1328f239c5
title: Yoyogi Stadium
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'
import stadium2 from './stadium-2.glb'

export function Model(props) {
  const { nodes, materials } = useGLTF(stadium2)
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh castShadow geometry={nodes.Object_2.geometry} material={materials.material_0} position={[0, 0, 2]} rotation={[0, 0, -20]} scale={[0.23, 0.23, 0.23]} >
        </mesh>
        <mesh castShadow geometry={nodes.Object_3.geometry} material={materials.material_0} position={[0, 0, 2]}  rotation={[0, 0, -20]}  scale={[0.23, 0.23, 0.23]}>
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload(stadium2)
